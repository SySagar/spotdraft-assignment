export const fieldErrorLabel = (touched?: any, error?: any) => {

    if (touched && error)
        return (
            <p className="text-sm text-red-500 mt-1">
                {error}
            </p>
        )
    else
        return ''
}