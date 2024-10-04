import BoxCard from "@/components/Box/BoxCard"

const BoxPage = () => {
    const input = [
        // [1, 1, 1],
        // [1, 0, 0],
        // [1, 1, 1]

        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0]
    ]

    return <div className="w-full h-screen flex flex-col gap-2 justify-center items-center">
        <BoxCard input={input} />
    </div>
}

export default BoxPage