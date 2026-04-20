import React from 'react';
import { useData } from '../../context/DataContext';

const AdminMessages: React.FC = () => {
  const { messages, deleteMessage, markMessageRead } = useData();

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mesaj Merkezi</h1>
            <p className="text-gray-500 text-sm mt-1">Web sitesinden gelen iletişim formları ve talepler.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold tracking-wider">Gönderen</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">İletişim</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Mesaj Detayı</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Tarih</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {messages.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-400">Henüz mesaj yok.</td></tr>
                    ) : messages.map(m => (
                        <tr key={m.id} className={`hover:bg-gray-50/80 transition-colors ${!m.read ? 'bg-gold-50/30' : 'bg-white'}`}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{m.name}</div>
                                {!m.read && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 mt-1.5 uppercase tracking-wide">Yeni</span>}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-700">{m.email}</div>
                                <div className="text-xs text-gray-400 font-mono mt-0.5">{m.phone}</div>
                            </td>
                            <td className="px-6 py-4 max-w-md">
                                <div className="font-bold text-gray-800 mb-1">{m.subject}</div>
                                <div className="text-gray-600 leading-relaxed text-xs">{m.message}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs font-mono">{m.date}</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {!m.read && (
                                        <button 
                                            onClick={() => markMessageRead(m.id)} 
                                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors" 
                                            title="Okundu İşaretle"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteMessage(m.id)} 
                                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" 
                                        title="Sil"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
  );
};

export default AdminMessages;
