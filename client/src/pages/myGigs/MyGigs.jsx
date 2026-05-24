import React from "react";
import { Link } from "react-router-dom";
import "./myGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        const d = res.data;
        return d?.gigs || (Array.isArray(d) ? d : []);
      }),
  });
  
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };
  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <div className="table-wrapper">
          <table>
            <tbody>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Actions</th>
            </tr>
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img className="image" src={gig.cover} alt="" />
                </td>
                <td>{gig.title}</td>
                <td>${gig.price}</td>
                <td>{gig.sales}</td>
                <td className="actions-cell">
                  <Link to={`/edit/${gig._id}`} className="link">
                    <img className="edit" src="/images/edit.png" alt="edit" title="Edit" />
                  </Link>
                  <img
                    className="delete"
                    src="/images/delete.png"
                    alt="delete"
                    title="Delete"
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGigs;