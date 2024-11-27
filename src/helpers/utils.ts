export const isFile = (accept: string, file: File | null): boolean => {
  if (!file) {
    return false;
  }

  return accept.split(", ").includes(file.type);
};

export const round = (num: number, prec?: any) => {
  if (prec === void 0) {
    prec = 2;
  }
  const f = Math.pow(10, prec);
  return Math.floor(num * f) / f;
};

export const base64toBlob = (base64Data: any) => {
  const base64DataPart = atob(base64Data.split(",")[1]);
  const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(base64DataPart.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < base64DataPart.length; i++) {
    ia[i] = base64DataPart.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return blob;
};
