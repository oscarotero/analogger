// Import library
const script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://unpkg.com/frappe-charts@latest";
document.head.appendChild(script);

// Create chart
script.addEventListener("load", () => {
  const { title, labels, datasets } = data;

  new frappe.Chart(
    document.getElementById("chart"),
    {
      title,
      type: "bar",
      height: 300,
      data: {
        labels,
        datasets: datasets.map((dataset) => {
          const { name, values } = dataset;
          return { name, values, chartType: "bar" };
        }),
      },
    },
  );
});
