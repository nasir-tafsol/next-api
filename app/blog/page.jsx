import Table from "react-bootstrap/Table";

const getData = async () => {
  let response = await fetch("https://dummyjson.com/posts?limit=5", {
    cache: "no-cache",
    mode: "cors",
    redirect: "follow",
  });
  let data = await response.json();
  return data;
};

export default async function Blog() {
  const { posts } = await getData();
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
