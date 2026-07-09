export const PatchNotes = () => {
    return (
        <section className="bg-[url('/landing/content-box-bg.jpg')] mi-contenedor overflow-y-auto max-h-[450px]  z-20 border-[1px] border-black/50 border-b-5 right-[12.5%] top-[20%] absolute bg-contain bg-repeat-y pl-3 w-[75%]  bg-red-200 mx-auto ">
            <div className="flex justify-center pb-3">
                <img src="/landing/patchnotes.png" className="pr-2" alt="" />
            </div>
            <h2 className="pl-3 pb-2 text-yellow-950 text-sm font-serif">Parche: 0.5.2</h2>
            <h2 className="pl-3 pb-2 text-yellow-950 text-sm font-serif">Fecha del parche: 24/11/2025</h2>
            <hr className="border-black w-[96.5%]" />
            <div className="text pb-2 min-w-100%   ">
                <h1 className="text-[25px] pb-2 text-center pr-3 text-red-700">Netim2 Beta ya esta aqui!</h1>
                <span className="text-[14px] text-yellow-950">Despues de una larga espera, la Beta llego al fin, y esta espera llego con nuevas novedades!!!</span>
                <ul className="list-disc text-[13px] list-inside text-sm">
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Misiones</h1>
                    <li className="pb-2 text-yellow-950">Nuevas misiones ya estan disponibles! Ahora en el juego se ha añadido un nuevo NPC, el Capitan, desde el nivel 1 ya tendras misiones que te ayudaran a progresar con tu personaje y a entender mejor el juego!</li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Gremio</h1>
                    <li className="pb-2 text-yellow-950">Nuevo sistem de Gremio. En Netim ya puedes crear tu propio gremio e invitar a tus amigos, donde con trabajo de equipo podras mejorarlo y obtener increibles mejoras, eventos , recompensas para volverte, junto a tus miembros del gremio, cada vez mas fuerte.</li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Pesca</h1>
                    <li className="pb-2 text-yellow-950">Se ha habilitado un nuevo NPC, el Pescador, donde tiene su propia tienda con nuevos items para poder inicializar en el mundo de la pesca. Con paciencia y habilidad podras obtener diferentes objetos importantes que te ayudaran con el progreso del juego.  </li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Tabla de Clasificacion</h1>
                    <li className="pb-2 text-yellow-950">Ya esta habilitada la tabla de clasificacion, donde se detallaran las estadisticas de cada jugador, como ganancias maximas, mobs derrotados, maximo nivel, y muchas mas.</li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Superando las Fronteras</h1>
                    <li className="pb-2 text-yellow-950">Se han añadido, nuevos mapas para seguir avanzando tu historia, con nuevos mobs, nuevos objetos, y nuevos desafios.</li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">Nuevo Sistema de Drop</h1>
                    <li className="pb-2 text-yellow-950">Un nuevo cambio en el sistema de drops, ahora los Mobs soltaran mas variedad de items.</li>
                    <h1 className="pt-1 text-red-800 font-semibold text-[15px]">El Inicio de las Mazmorras</h1>
                    <li className="pb-2 text-yellow-950">Ya se encuentran las primeras mazmorras de Netim!!!, a partir del nivel 25, ya podras adentrarte a la primera mazmorra, la mazmorra de Monos, y mas adelante la Torre Demoniaca... Con grandes desafios y recompensas para quienes logren superar estas pruebas. </li>
                </ul>
            </div>
        </section>
    )
}