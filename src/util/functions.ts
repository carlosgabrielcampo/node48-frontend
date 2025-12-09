export const copyToClipboard = (value) => {
    console.log(value)
    navigator.clipboard.writeText(value)
}