import React, { useState, useRef, useEffect } from "react";
import './gigs.scss';
import GigCard from '../../components/GigCard/GigCard';
import { SkeletonCard } from '../../components/skeleton/Skeleton';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

const Gigs = () => {
    const [open, setopen] = useState(false);
    const [sort, setsort] = useState("sales");
    const [page, setPage] = useState(1);
    const minRef = useRef();
    const maxRef = useRef();
    const { search } = useLocation();

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['gigs', search, sort, page],
        queryFn: () =>
            newRequest.get(`/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}&page=${page}&limit=20`)
            .then((res) => res.data)
    });

    useEffect(() => { setPage(1); }, [search]);

    const resort = (type) => {
        setsort(type);
        setopen(false);
        setPage(1);
    };

    const apply = () => {
        setPage(1);
        refetch();
    };

    const gigs = data?.gigs || (Array.isArray(data) ? data : []);
    const totalPages = data?.pages || 1;

    return ([
        <div className="gigs" key="gigs">
            <div className="container">
                <span className="breadcrumbs">FIVERR &gt; BROWSE GIGS</span>
                <h1>Browse Gigs</h1>
                <p>Explore freelance services from talented professionals</p>
                <div className="menu">
                    <div className="left">
                        <span>Budget</span>
                        <input ref={minRef} type="number" placeholder="min" />
                        <input ref={maxRef} type="number" placeholder="max" />
                        <button onClick={apply}>Apply</button>
                    </div>
                    <div className="right">
                        <span className="sortBy">Sort By</span>
                        <span className="sortType">{sort === "sales" ? "Best Selling" : "Newest"}</span>
                        <img src="/images/down.png" alt="sort" onClick={() => setopen(!open)} />
                        {open && (
                            <div className="rightMenu">
                                {sort === "sales"
                                    ? <span onClick={() => resort('createdAt')}>Newest</span>
                                    : <span onClick={() => resort('sales')}>Best Selling</span>
                                }
                                <span onClick={() => resort("sales")}>Popular</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="cards">
                    {isLoading
                        ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
                        : error
                            ? <h4 style={{ color: "red" }}>Something went wrong. Please try again.</h4>
                            : gigs.length === 0
                                ? <h4 style={{ color: "#d9480f" }}>No gigs found for your search.</h4>
                                : gigs.map((gig) => <GigCard key={gig._id} item={gig} />)
                    }
                </div>
                {!isLoading && !error && totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    ]);
}
export default Gigs;
