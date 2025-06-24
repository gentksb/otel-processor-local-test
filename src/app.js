async function main() {
  try {
    const response = await fetch("http://example.com");
    const status = response.status;
    const data = await response.text();
    console.log(`status: ${status}\n`, `data: ${data}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

main();
