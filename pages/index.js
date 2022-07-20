import Head from "next/head";
const http = require("http");

const apiUrl =   process.env.API_URL ? process.env.API_URL : "http://localhost:3000";

export async function getServerSideProps(context) {
  const address = context.query.address;
  if (!address) {
    return { props: {}};
  }
  const res = await fetch(`${apiUrl}/api/balances/${address}`);
  const data = await res.json();

  return { props: { data } };
}

export default function Main({data}) {
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
                <td>{data[0].avgGwei}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[1].date}</td>
                <td>{data[1].avgGwei}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[2].date}</td>
                <td>{data[2].avgGwei}</td>
                <td></td>
              </tr>
              {/* <tr>
                <td>{data[3].date}</td>
                <td>{data[3].avgGwei}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[4].date}</td>
                <td>{data[4].avgGwei}</td>
                <td></td>
              </tr>
              <tr>
                <td>{data[5].date}</td>
                <td>{data[5].avgGwei}</td>
                <td></td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
