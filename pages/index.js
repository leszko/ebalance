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
  const balancesPromise = fetch(`${apiUrl}/api/balances/${address}?lastN=21`).then((r) => {
    return r.json()
  });

  const exchangeRatesPromise = fetch('https://api.coingecko.com/api/v3/simple/price?ids=livepeer%2Cethereum&vs_currencies=usd').then((r) => {
    return r.json()
  })

  const balances = await balancesPromise;
  const exchangeRates = await exchangeRatesPromise;

  const result = balances.map((b) => {
    return { date: b.date, avgEth: formatGwei(b.avgEth), avgLpt: formatGwei(b.avgLpt), avglEth: formatGwei(b.avglEth), sumEth: formatGwei(b.avgEth + b.avglEth) };
  });

  const profitForDays = [1, 7, balances.length - 1]
  const profits = []
  for (const d of profitForDays) {
    const profitEth = (result[0].sumEth - result[d].sumEth) * exchangeRates.ethereum.usd
    const profitLpt = (result[0].avgLpt - result[d].avgLpt) * exchangeRates.livepeer.usd
    profits.push({
      days: d,
      profit: profitEth + profitLpt
    })
  }

  return { props: { data: {
    result: result,
    profits: profits
  }}};
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
              {data.result.map((d, index) => (
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
        <div>
          {data.profits.map((d, index) => (
            <p>Your profit for last <b>{d.days}</b> day(s) is <b>${d.profit.toFixed(2)}</b></p>
          ))}
        </div>
      </main>
    </div>
  );
}
