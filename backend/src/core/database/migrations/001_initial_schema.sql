-- backend/src/core/database/schema.sql
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id),
    account_number VARCHAR(50) NOT NULL,
    agency VARCHAR(20),
    account_type VARCHAR(20) CHECK (account_type IN ('CHECKING', 'SAVINGS', 'INVESTMENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, account_number, agency)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'MANAGER', 'ANALYST', 'AUDITOR')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounting_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id),
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    operation_type VARCHAR(10) CHECK (operation_type IN ('CREDIT', 'DEBIT')),
    category_id UUID REFERENCES categories(id),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECONCILED', 'IGNORED', 'DIVERGENCE')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transaction_date ON accounting_entries(transaction_date);
CREATE INDEX idx_status ON accounting_entries(status);


CREATE TABLE IF NOT EXISTS bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id),
    statement_date DATE NOT NULL,
    opening_balance DECIMAL(15,2) NOT NULL,
    closing_balance DECIMAL(15,2) NOT NULL,
    file_name VARCHAR(255),
    file_hash VARCHAR(64) UNIQUE, -- Para evitar duplicatas
    imported_by UUID REFERENCES users(id),
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT false
);
CREATE INDEX idx_statement_date ON bank_statements(statement_date);


CREATE TABLE IF NOT EXISTS statement_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_id UUID REFERENCES bank_statements(id),
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    operation_type VARCHAR(10) CHECK (operation_type IN ('CREDIT', 'DEBIT')),
    suggested_category_id UUID REFERENCES categories(id),
    matched_entry_id UUID REFERENCES accounting_entries(id),
    match_type VARCHAR(20) CHECK (match_type IN ('AUTO', 'MANUAL', 'PENDING')),
    match_score DECIMAL(5,2), -- Score de similaridade para match automático
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_match_status ON statement_items(match_type);

CREATE TABLE IF NOT EXISTS reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id),
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REVIEW', 'APPROVED', 'CLOSED')),
    opening_balance DECIMAL(15,2) NOT NULL,
    calculated_balance DECIMAL(15,2),
    adjusted_balance DECIMAL(15,2),
    performed_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);
CREATE INDEX idx_period ON reconciliations(period_start, period_end);
CREATE INDEX idx_status_reconciliations ON reconciliations(status);


CREATE TABLE IF NOT EXISTS reconciliation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_id UUID REFERENCES reconciliations(id),
    statement_item_id UUID REFERENCES statement_items(id),
    accounting_entry_id UUID REFERENCES accounting_entries(id),
    match_status VARCHAR(20) CHECK (match_status IN ('MATCHED', 'DIVERGENCE', 'PENDING', 'IGNORED')),
    divergence_type VARCHAR(50),
    divergence_amount DECIMAL(15,2),
    justification TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    previous_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_created_at ON audit_logs(created_at);
CREATE INDEX idx_user_action ON audit_logs(user_id, action);


CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, previous_values, new_values)
        VALUES (
            current_setting('app.user_id', TRUE)::UUID,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, previous_values)
        VALUES (
            current_setting('app.user_id', TRUE)::UUID,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (
            current_setting('app.user_id', TRUE)::UUID,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger às tabelas críticas
CREATE TRIGGER audit_accounting_entries
AFTER INSERT OR UPDATE OR DELETE ON accounting_entries
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_reconciliations
AFTER INSERT OR UPDATE OR DELETE ON reconciliations
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_bank_statements
AFTER INSERT OR UPDATE OR DELETE ON bank_statements
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
