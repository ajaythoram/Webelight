import { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from 'highcharts';
import { HighchartsReact } from "highcharts-react-official";
import { CircularProgress } from "@mui/material";

const DEFAULT_OPTIONS = {
    xAxis: {
        type: 'datetime'
    },
    lang: {
        noData: 'No Data available'
    }
}

export default function ActivityChart({ addition = false, deletion = false,repo,profile }) {
    const [chartLoading, setChartLoading] = useState(false);
    const [activity, setActivity] = useState([]);
    const [contributorActivity, setContributorActivity] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [contributorData, setContributorData] = useState([]);
    console.log(repo,profile);

    useEffect(() => {
        const fetchData = async () => {
            setChartLoading(true);

            try {
                const activityResponse = await axios.get(`https://api.github.com/repos/${profile}/${repo}/stats/commit_activity`);
                const contributorResponse = await axios.get(`https://api.github.com/repos/${profile}/${repo}/stats/contributors`);

                setActivity(activityResponse.data || []);
                setContributorActivity(contributorResponse.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setChartLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const seriesData = [];
        if ((typeof activity === 'object' && Object.keys(activity)?.length > 0) || activity?.length > 0) {
            if (addition) {
                activity?.map((item) => {
                    seriesData.push([Number(item[0] + '000'), item[1]])
                })
            } else if (deletion) {
                activity?.map((item) => {
                    seriesData.push([Number(item[0] + '000'), Math.abs(item[2])])
                })
            } else {
                activity?.map((item) => {
                    seriesData.push([Number(item.week + '000'), item.total])
                })
            }
        }
        setActivityData(seriesData);
    }, [activity])

    useEffect(() => {
        const seriesData = [];
        if ((typeof contributorActivity === 'object' && Object.keys(contributorActivity)?.length > 0) || contributorActivity?.length > 0) {
            contributorActivity?.map((item) => {
                const yData = item?.weeks?.map((weekData) => [Number(weekData.w + '000'), (addition ? weekData.a : deletion ? weekData.d : weekData.c)]);
                seriesData.push({ name: item?.author?.login, data: yData });
            })
        }
        setContributorData(seriesData);
    }, [contributorActivity])

    return (
        <>
            {!chartLoading && <HighchartsReact
                highcharts={Highcharts}
                options={{
                    ...DEFAULT_OPTIONS,
                    title: {
                        text: 'Total Changes'
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        formatter: function () {
                            return `Week: <b>${new Date(this.x)}</b><br />Changes: <b>${this.y}</b>`
                        }
                    },
                    series: {
                        type: 'line',
                        name: 'Changes',
                        data: activityData,
                        color: addition ? '#00FF00' : deletion ? '#FF0000' : ''
                    }
                }} />}
            {!chartLoading && <HighchartsReact
                highcharts={Highcharts}
                options={{
                    ...DEFAULT_OPTIONS,
                    title: {
                        text: 'Contributor Changes'
                    },
                    tooltip: {
                        formatter: function () {
                            return `
                            Week: <b>${new Date(this.x)}</b><br />Changes: <b>${this.y}</b><br />Contributor: <b>${this.series.name}</b>
                        `
                        }
                    },
                    series: contributorData
                }} />}
            {chartLoading && <CircularProgress />}
        </>
    )
}
