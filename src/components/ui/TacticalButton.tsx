import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { type ReactNode } from 'react';
import { useSound } from '../../context/SoundContext';

interface TacticalButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    glow?: boolean;
    children: ReactNode;
}

export function TacticalButton({
    className,
    variant = 'primary',
    glow = false,
    children,
    ...props
}: TacticalButtonProps) {
    const { playHover, playClick } = useSound();

    const baseStyles = "relative px-6 py-3 font-bold uppercase tracking-wider text-sm overflow-hidden transition-all duration-300 clip-path-chamfer";

    const variants = {
        primary: "bg-emerge-green text-black hover:bg-emerge-green/90 border border-transparent",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30",
        danger: "bg-emerge-red text-white hover:bg-emerge-red/90 border border-transparent",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    };

    const glowStyles = glow ? "shadow-[0_0_20px_rgba(52,199,89,0.3)] hover:shadow-[0_0_30px_rgba(52,199,89,0.6)]" : "";

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => playHover()}
            onClick={(e) => {
                playClick();
                props.onClick?.(e);
            }}
            className={cn(baseStyles, variants[variant], glowStyles, className)}
            {...props}
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
