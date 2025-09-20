import { Star } from "lucide-react";

// Star Rating Component
export const StarRating = ({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
                const difference = rating - i;

                return (
                    <div key={i} className="relative">
                        {/* Base star (always gray) */}
                        <Star className={`${className} text-gray-300`} />

                        {/* Filled portion overlay */}
                        {difference > 0 && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    clipPath: `polygon(0 0, ${Math.min(difference * 100, 100)}% 0, ${Math.min(difference * 100, 100)}% 100%, 0 100%)`
                                }}
                            >
                                <Star className={`${className} fill-yellow-400 text-yellow-400`} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}