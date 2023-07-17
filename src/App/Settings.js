export const CaraUrls = async () => {
    const uri = `${window.location.protocol}//${window.location.host}/api/config/GetCARAURL`;
    var response = await fetch(uri);
    let text = await response.text();
    let obj = JSON.parse(text);
    return obj; 
 }