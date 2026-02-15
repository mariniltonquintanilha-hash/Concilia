import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow p-4 text-center text-sm text-gray-500 mt-auto">
      &copy; {new Date().getFullYear()} Sistema de Conciliação Bancária Profissional. Todos os direitos reservados.
    </footer>
  );
};

export default Footer;
