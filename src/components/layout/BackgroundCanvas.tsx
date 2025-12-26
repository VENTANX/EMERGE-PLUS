import { useEffect, useRef } from 'react';

export function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const stars: { x: number, y: number, z: number }[] = [];
        const count = 150;

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width
            });
        }

        let animationId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw subtle grid
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)'; // Slight green tint
            ctx.lineWidth = 1;
            const gridSize = 80;

            // Perspective shift simulation
            const time = Date.now() * 0.0001;
            const offsetX = Math.sin(time) * 20;
            const offsetY = Math.cos(time) * 20;

            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + offsetX, 0);
                ctx.lineTo(x - offsetX, height);
                ctx.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y + offsetY);
                ctx.lineTo(width, y - offsetY);
                ctx.stroke();
            }

            // Draw Stars (Warp Speed Effect)
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < count; i++) {
                const star = stars[i];
                star.z -= 2; // speed

                if (star.z <= 0) {
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                    star.z = width;
                }

                const x = (star.x / star.z) * width + width / 2;
                const y = (star.y / star.z) * height + height / 2;
                const size = (1 - star.z / width) * 2;

                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const alpha = (1 - star.z / width) + 0.3; // Boost alpha
                    ctx.globalAlpha = alpha > 1 ? 1 : alpha;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
        />
    );
}
