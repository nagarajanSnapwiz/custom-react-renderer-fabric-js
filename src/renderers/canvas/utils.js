function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase()
}

export function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}


export function getEventProps(props){
    const keys = Object.keys(props).filter(x => x.startsWith("on"));
    return keys.reduce((acc,curr)=> {
        const eventKey = curr.replace('on','').toLowerCase();
        const eventCallback = props[curr];
        return {...acc,[eventKey]: eventCallback};
    },{})
}