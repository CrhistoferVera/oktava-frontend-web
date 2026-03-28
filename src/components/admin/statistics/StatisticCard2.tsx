import React from 'react'

export const StatisticCard2 = () => {
  return (
    <div className="flex gap-10 bg-[#161616] border border-gray-400 rounded-lg pb-4 pt-4 px-5">
        <div>
            <h3 className="text-gray-300 text-[12px] font-bold">TIEMPO PROM</h3>
            <h3 className="text-3xl text-white font-bold">  34 MIN</h3>
            <p className="text-gray-500">
                <span className="text-red-500 font-bold"> + 2MIN</span> vs ayer
            </p>
        </div>
        <div className="text-4xl m-auto">
            ⏱️
        </div>
    </div>
  )
}
