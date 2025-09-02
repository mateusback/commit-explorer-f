import React from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import { useAuthInterceptor } from '../../hooks/useAuthInterceptor';

export default function AppLayout() {
  useAuthInterceptor();
  
  const matches = useMatches();
  const meta = [...matches].reverse().find(m => m.handle?.title) ?.handle ?? {
    title: 'Visão Geral dos Projetos',
    subtitle: 'Insights agregados de todos os repositórios dos alunos.'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 text-stone-700">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto bg-stone-50">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <Outlet />
        <footer className="mt-8 text-center text-sm text-stone-400 print:hidden">
          Commit Explorer &copy; 2025
        </footer>
      </main>
    </div>
  );
}
