import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./admin.scss";

const Admin = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading: loadingStats, error: errorStats, data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => newRequest.get("/admin/stats").then((res) => res.data),
    enabled: !!currentUser?.isAdmin,
  });

  const { isLoading: loadingUsers, error: errorUsers, data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => newRequest.get("/admin/users").then((res) => res.data),
    enabled: !!currentUser?.isAdmin,
  });

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser?.isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="admin">
      <div className="container">
        <h1>Admin Panel</h1>
        {loadingStats ? (
          "loading"
        ) : errorStats ? (
          "failed to load stats"
        ) : (
          <div className="stats">
            <div className="card"><h3>Users</h3><span>{stats.users}</span></div>
            <div className="card"><h3>Sellers</h3><span>{stats.sellers}</span></div>
            <div className="card"><h3>Gigs</h3><span>{stats.gigs}</span></div>
            <div className="card"><h3>Orders</h3><span>{stats.orders}</span></div>
            <div className="card"><h3>Reviews</h3><span>{stats.reviews}</span></div>
            <div className="card"><h3>Conversations</h3><span>{stats.conversations}</span></div>
            <div className="card"><h3>Messages</h3><span>{stats.messages}</span></div>
          </div>
        )}

        <h2>Recent Users</h2>
        {loadingUsers ? (
          "loading"
        ) : errorUsers ? (
          "failed to load users"
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Seller</th>
                <th>Admin</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.isSeller ? "Yes" : "No"}</td>
                  <td>{user.isAdmin ? "Yes" : "No"}</td>
                  <td>{user.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
