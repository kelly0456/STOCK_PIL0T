import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const [monthly, setMonthly] = useState([]);
    const [yearly, setYearly] = useState([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
            };

         const month = await axios.get(
    `${API_URL}/api/reports/monthly`,
    { headers }
);

const year = await axios.get(
    `${API_URL}/api/reports/yearly`,
    { headers }
);

            setMonthly(month.data);
            setYearly(year.data);

        } catch (err) {
            console.log(err);
        }

    };

    const formatKES = (amount) =>
        new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
        }).format(amount);

    return (

        <div className="container-fluid py-4">

            <h2 className="fw-bold mb-4">
                Financial Reports
            </h2>

            <div className="card shadow mb-4">

                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        Monthly Income
                    </h5>
                </div>

                <div className="card-body">

                    <table className="table table-striped">

                        <thead>

                            <tr>
                                <th>Year</th>
                                <th>Month</th>
                                <th>Sales</th>
                                <th>Income</th>
                            </tr>

                        </thead>

                        <tbody>

                            {monthly.map((m) => (

                                <tr key={`${m._id.year}-${m._id.month}`}>

                                    <td>{m._id.year}</td>

                                    <td>{m._id.month}</td>

                                    <td>{m.totalSales}</td>

                                    <td>
                                        {formatKES(m.totalIncome)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="card shadow">

                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                        Yearly Income
                    </h5>
                </div>

                <div className="card-body">

                    <table className="table table-striped">

                        <thead>

                            <tr>
                                <th>Year</th>
                                <th>Sales</th>
                                <th>Income</th>
                            </tr>

                        </thead>

                        <tbody>

                            {yearly.map((y) => (

                                <tr key={y._id.year}>

                                    <td>{y._id.year}</td>

                                    <td>{y.totalSales}</td>

                                    <td>
                                        {formatKES(y.totalIncome)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}