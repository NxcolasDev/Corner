import React, { useState } from "react";
import { Plus, Search, Layers, Play, MoreVertical, BookOpen } from "lucide-react";

export default function Decks({ decks = [], onSelectDeck, onCreateDeck }) {
  const [search, setSearch] = useState("");

  const filteredDecks = decks.filter((deck) =>
    deck.title?.toLowerCase().includes(search.toLowerCase()) ||
    deck.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Biblioteca de Baralhos
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Gerencie seus conjuntos de estudo e crie novos cards.
          </p>
        </div>

        <button
          onClick={onCreateDeck}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} />
          Novo Baralho
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título ou categoria..."
          className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition shadow-xs"
        />
      </div>

      {/* Grid de Baralhos */}
      {filteredDecks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <div
              key={deck._id || deck.id}
              className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-xl border border-blue-100">
                    {deck.category || "GERAL"}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {deck.description || "Sem descrição informada."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Layers size={15} className="text-slate-400" />
                  <span>{deck.cardsCount || 0} cards</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDeck && onSelectDeck(deck._id || deck.id)}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                  >
                    Gerenciar
                  </button>
                  <button
                    onClick={() => onSelectDeck && onSelectDeck(deck._id || deck.id)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
                  >
                    <Play size={12} fill="currentColor" />
                    Estudar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 border border-dashed border-slate-300 rounded-3xl space-y-3">
          <BookOpen size={40} className="mx-auto text-slate-300" />
          <p className="text-base font-bold text-slate-700">Nenhum baralho encontrado</p>
          <p className="text-xs text-slate-400">
            Tente mudar o termo da busca ou crie um novo baralho no botão acima.
          </p>
        </div>
      )}
    </div>
  );
}