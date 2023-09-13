export default function concatTitle(title = '', description = '') {
    return title
        .split(' ')
        .map((str) => str.charAt(0).toUpperCase().concat(str.slice(1)))
        .join(' ')
        .concat(` ${title && '-'} ${description} | nvi app`)
        .replace(/\./, '')
        .trim()
}
