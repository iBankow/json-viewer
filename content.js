const rawContent = document.body.innerText;
try {
  if (!rawContent.trim()) throw new Error();

  const jsonObject = JSON.parse(rawContent);

  const formattedHtml = syntaxHighlight(jsonObject);

  document.body.innerHTML = `<pre class="json-container">${formattedHtml}</pre>`;

  document.body.style.visibility = "visible";

  const dates = document.querySelectorAll(".date");

  console.log(dates);

  for (const dateElement of dates) {
    const dateStr = dateElement.textContent.replace(/"/g, "");
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj)) {
      const formattedDate = dateObj.toLocaleString();
      dateElement.setAttribute("title", dateStr);

      dateElement.textContent = formattedDate;
    }
  }
} catch (e) {
  document.body.style.visibility = "visible";
}

function isDatePattern(str) {
  const cleanStr = str.replace(/"/g, "");

  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/, // ISO 8601
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY ou MM/DD/YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // Variações com 1 ou 2 dígitos
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];

  return datePatterns.some((pattern) => pattern.test(cleanStr));
}

function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2); // Indentação de 4 espaços
  }

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      const cls = getTokenClass(match);
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function getTokenClass(match) {
  if (/^"/.test(match) && /:$/.test(match)) {
    return "key";
  }

  if (/^"/.test(match)) {
    return isDatePattern(match) ? "date" : "string";
  }

  if (/true|false/.test(match)) {
    return `boolean ${match}`;
  }

  if (/null/.test(match)) {
    return "null";
  }

  return "number";
}
