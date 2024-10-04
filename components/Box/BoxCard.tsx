"use client"
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react"

interface BoxCardProps {
    input: number[][]
}

const BoxCard: FC<BoxCardProps> = ({ input }) => {
    const m = input[0].length;

    const initialValue = input.map(item => item.map(() => false))

    const calc = (arr: (number | boolean)[][]) => {
        let totalBoxes = 0
        const n = arr.length, m = arr[0].length;
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < m; ++j) {
                if (arr[i][j]) {
                    totalBoxes++;
                }
            }
        }
        return totalBoxes
    }
    const totalBoxes = calc(input)

    const [value, setValue] = useState(initialValue)
    type StackType = {
        x: number,
        y: number
    }
    const [stack, setStack] = useState<StackType[]>([])
    const [lock, setLock] = useState(false)

    const onClick = (item: number, x: number, y: number) => {
        // if (!item || value[x][y] || lock) return
        if (!item || lock) return

        setValue(prev => {
            const newValue = [...prev]
            const val = !newValue[x][y]
            newValue[x][y] = val
            setStack(prevStack => {
                let newStack = [...prevStack]
                if (val) {
                    newStack.push({ x, y })
                }
                else {
                    newStack = newStack.filter(item => item.x !== x || item.y !== y);
                }
                return newStack;
            })

            return newValue
            // setStack()
        })


    }

    useEffect(() => {
        const curBoxes = calc(value)
        if (curBoxes == totalBoxes && curBoxes == stack.length) {
            deselection()
        }


    }, [stack])

    const wait = (time: number) => new Promise((resolve) => setTimeout(() => resolve(""), time))

    const updateValue = (x: number, y: number) => {
        setValue(prev => {
            const newValue = [...prev]
            newValue[x][y] = false
            return newValue
        })
    }

    const deselection = async () => {
        // console.log("started")
        setLock(true)
        //adding a delay of 1 sec
        await wait(1000)
        const currStack = [...stack]
        for (let i = 0; i < currStack.length; ++i) {
            const cur = currStack[i]
            updateValue(cur.x, cur.y)
            await wait(1500)
        }
        //clearing stack
        setStack([])
        setLock(false)
    }

    console.log("value", value)
    console.log("stack", stack)

    return <div>
        <div className={cn("grid gap-2 ", `grid-cols-${m}`)}
            style={{ gridTemplateColumns: `repeat(${m}, minmax(0, 1fr))` }}
        >
            {input.map((item, index) =>
                item.map((item1, index2) => <div key={index + index2}
                    onClick={() => { onClick(item1, index, index2) }}
                    className={cn("border border-black p-4 w-4 h-4 ", item1 ? "" : "opacity-0"
                        , value[index][index2] ? "bg-[#0bcc59]" : ""
                    )}>
                </div>)
            )}
        </div>
    </div>
}
export default BoxCard