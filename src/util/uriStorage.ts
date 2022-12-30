export class URIParamterStorage {
  getItem(key: string) {
    const uri = new URL(window.location.href);
    console.log(key, uri.searchParams.get(key));
    return uri.searchParams.get(key);
  }

  setItem(key: string, value: string) {
    const uri = new URL(window.location.href);
    uri.searchParams.set(key, value);
    window.history.replaceState({}, "", uri.toString());
  }

  removeItem(key: string) {
    const uri = new URL(window.location.href);
    uri.searchParams.delete(key);
    window.history.replaceState({}, "", uri.toString());
  }
}
