export default function LoadingContainer(){
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-500 border-opacity-75 mx-auto my-auto"></div>
        </div>
    )
}