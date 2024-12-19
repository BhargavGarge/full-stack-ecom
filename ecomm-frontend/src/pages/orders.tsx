import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"; // Importing a Higher-Order Component (HOC) for rendering a table dynamically.
import { Column } from "react-table"; // Importing the Column type from react-table to define the table's column structure.
import { Link } from "react-router-dom"; // Importing Link for navigation between routes.

// The `DataType` type defines the shape of the data that will populate the table. Each row contains fields such as `_id` for the order ID,
// `amount` for the total amount of the order, `quantity` for the number of items in the order, `discount` for the applied discount,
// `status` to show the order's current state using a React element (e.g., a span), and `action` which is another React element for user interaction (e.g., a link to view order details).
type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

// The `column` array defines the structure of the table, mapping headers to the corresponding fields in the data.
// Each column specifies a `Header` for the table's header section and an `accessor` to fetch data from the corresponding property of a row.
const column: Column<DataType>[] = [
  { Header: "ID", accessor: "_id" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

const Orders = () => {
  // The `rows` state initializes with a single sample order. Each row represents an order with details like `amount`,
  // `quantity`, `discount`, and two React elements for `status` (e.g., "Processing" displayed in red) and `action`
  // (e.g., a link to navigate to the specific order details page).
  const [rows] = useState<DataType[]>([
    {
      _id: "1",
      amount: 100,
      quantity: 2,
      discount: 10,
      status: <span className="red">Processing</span>,
      action: <Link to={`/orders/1`}>View</Link>,
    },
  ]);

  // The `TableHOC` function is used to dynamically generate a table component.
  // It takes the column definitions, row data, a CSS class for styling, a title for the table,
  // and a boolean flag for enabling pagination if there are more than 6 rows.
  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-prodcut-box",
    "Orders",
    rows.length > 6
  )();

  // The `Orders` component renders a container with a title and the dynamically generated table.
  // The table is populated with the defined rows and columns, allowing users to view and interact with order data.
  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );
};

export default Orders; // Exports the Orders component for use in other parts of the application.
