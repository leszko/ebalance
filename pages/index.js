import Head from "next/head";
const http = require("http");

function formatGwei(gwei) {
  const eth = gwei / 1000000000;
  return eth.toFixed(6);
}

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : "http://localhost:3000";

export async function getServerSideProps(context) {
  const address = context.query.address;
  if (!address) {
    return { props: {} };
  }
  const balances = await fetch(`${apiUrl}/api/balances/${address}`);
  const data = await balances.json();
  const result = data.map((b) => {
    return { date: b.date, avgEth: formatGwei(b.avgEth), avgLpt: formatGwei(b.avgLpt), avglEth: formatGwei(b.avglEth), sumEth: formatGwei(b.avgEth + b.avglEth) };
  });

  return { props: { data: result } };
}

export default function Main({ data }) {
  return (
    <div>
      <Head>
        <title>eBalance</title>
      </Head>

      <main>
        <div>
          <table border="1">
            <tbody>
              <tr>
                <th>Date</th>
                <th>ETH</th>
                <th>fees ETH</th>
                <th>sum ETH</th>
                <th>LPT</th>
              </tr>
              {data.map((d, index) => (
                <tr key="{d.date}">
                  <td>{d.date}</td>
                  <td>{d.avgEth}</td>
                  <td>{d.avglEth}</td>
                  <td>{d.sumEth}</td>
                  <td>{d.avgLpt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
