export const DateConvert: string = (published: string) => {
  const date = new Date(published).toLocaleDateString()
  return date
}

/*
const DateConvert: string = (published: string) => {
  const inputDate = new Date(published);
  
  if (isNaN(inputDate.getTime())) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
*/
