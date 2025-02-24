const HeadingText = ({text}: {text: string}) => {
    return(
        <div className="h-[50px] w-full p-2">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-t from-orange-600  to-orange-400 bg-clip-text text-transparent">{text}</h1>
        </div>
    )
}

export default HeadingText;