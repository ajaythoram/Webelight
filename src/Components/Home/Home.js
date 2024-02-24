import { useEffect, useState } from "react";
import axios from "axios";
import "..//Home/Home.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaginationRounded from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ActivityChart from "../Chart/Chart";

const Home = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [repo, setRepo] = useState("");
    const [profile, setProfile] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedItemId, setExpandedItemId] = useState(null);

    const handlepageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.github.com/search/repositories?q=created:%3E2017-10-22&sort=stars&order=desc&page=${page}`
                );
                const userData = response.data.items;
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const handleArrowClick = (itemId, itemName, itemProfile) => {
        if (expandedItemId === itemId) {
            setExpandedItemId(null);
            setRepo("");
            setProfile("");
        } else {
            setExpandedItemId(itemId);
            setRepo(itemName);
            setProfile(itemProfile);
        }
    };

    return (
        <div id="main-container">
            {loading ? (
                <Loader />
            ) : (
                users.map((item) => {
                    const isExpanded = expandedItemId === item.id;
                    return (
                        <div key={item.id} className="child-div">
                            <div className="avatar">
                                <img src={item.owner.avatar_url} alt="User Avatar" />
                            </div>
                            <div className="two">
                                <div className="profile">
                                    <p>Repository Name: {item.name}</p>
                                    <p>Description: {item.description}</p>
                                </div>
                                <div className="number">
                                      <p>No. of stars: {item.watchers}</p>
                                        <p>No. of issues: {item.open_issues}</p>
                                        <p>Published by :{item.owner.login}</p>
                                        <p>Last Published: {item.updated_at}</p>
                                         </div>
                                {isExpanded && (
                                    <div className="chart">
                                        
                                        <ActivityChart repo={repo} profile={profile} />
                                    </div>
                                )}
                            </div>
                            <div>
                                {/* Only show the down arrow if item is expanded */}
                                {isExpanded ? (
                                    <KeyboardArrowDownIcon
                                        onClick={() => handleArrowClick(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    // Only show the forward arrow if item is not expanded
                                    <ArrowForwardIosIcon
                                        onClick={() => handleArrowClick(item.id, item.name, item.owner.login)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            <PaginationRounded handlepageChange={handlepageChange} />
        </div>
    );
};

export default Home;
