import Head from "next/head";

export default function Home() {
  const data = [
    { date: "14.07.2022", ethBalance: "0.12" },
    { date: "15.07.2022", ethBalance: "0.11" },
    { date: "16.07.2022", ethBalance: "0.04" },
    { date: "17.07.2022", ethBalance: "0.06" },
    { date: "18.07.2022", ethBalance: "0.04" },
    { date: "19.07.2022", ethBalance: "0.05" },
  ];

  let tableContent = "";
  data.forEach(d => {
    tableContent+= `<tr><td>${d.date}</td><td>${d.ethBalance}</td><td></td></tr>`;
  });

  return (
    <div>
      <Head>
        <title>eBalance</title>
      </Head>

      <main>
        <p>Get started by editing.</p>

        <div>
          <table border="1"> 
            <tbody>
              <tr>
                <th>Date</th>
                <th>ETH</th>
                <th>Description</th>
              </tr>
              <tr>
                <td>{data[0].date}</td>
                <td>{data[0].ethBalance}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[1].date}</td>
                <td>{data[1].ethBalance}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[2].date}</td>
                <td>{data[2].ethBalance}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[3].date}</td>
                <td>{data[3].ethBalance}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[4].date}</td>
                <td>{data[4].ethBalance}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[5].date}</td>
                <td>{data[5].ethBalance}</td>
                <td></td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
