import { useEffect, useState } from 'react'

interface InitiativeRollProps {
    value: number
    delay: number
    breakerRoll?: number
    onReveal?: () => void
}

export const InitiativeRoll = ({
    value,
    delay,
    breakerRoll,
    onReveal
}: InitiativeRollProps) => {
    const [displayValue, setDisplayValue] = useState(1)
    const [displaySecondValue, setDisplaySecondValue] = useState(1)
    const [rolling, setRolling] = useState(true)

    useEffect(() => {
        setRolling(true)

        const interval = window.setInterval(() => {
            setDisplayValue(
                Math.floor(Math.random() * 20) + 1
            )
        }, 70)

        const timeout = window.setTimeout(() => {
            window.clearInterval(interval)

            setDisplayValue(value)
            setRolling(false)

            onReveal?.()
        }, delay)

        return () => {
            window.clearInterval(interval)
            window.clearTimeout(timeout)
        }
    }, [value, delay, onReveal])

    useEffect(() => {
        setRolling(true)

        const interval = window.setInterval(() => {
            setDisplaySecondValue(
                Math.floor(Math.random() * 20) + 1
            )
        }, 70)

        const timeout = window.setTimeout(() => {
            window.clearInterval(interval)

            setDisplaySecondValue(breakerRoll ?? 0)
            setRolling(false)

            onReveal?.()
        }, delay)

        return () => {
            window.clearInterval(interval)
            window.clearTimeout(timeout)
        }
    }, [breakerRoll, delay, onReveal])

    return (
        <div
            className={`
                flex h-12 w-15 items-center justify-center
                rounded-xl border-2
                text-white
                text-xl 
                transition-all duration-300

                ${rolling
                    ? 'scale-110 border-yellow-400 bg-yellow-400/10'
                    : 'scale-100 border-white/30 bg-black/30'
                }
            `}
        >
            {displayValue}.<p className='text-[16px] pl'>{displaySecondValue ?? 0}</p>
        </div>
    )
}