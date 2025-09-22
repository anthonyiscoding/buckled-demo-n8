import Image from "next/image"
interface SocketStatusProps {
    src: string
    alt?: string
}
export const SocketStatus = ({ src, alt }: SocketStatusProps) => {
    return (
        <div className="w-32 h-32 flex items-center justify-center mx-auto mb-4">
            <Image
                src={src}
                alt={alt ?? "Socket character"}
                className="w-full h-full object-contain animate-socket-appear max-h-[300px]"
                width={120}
                height={300}
            />
        </div>
    )
}