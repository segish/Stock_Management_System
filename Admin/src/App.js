
import { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"
import Topbar from "./components/admincomponents/Topbar";
import Sidebar from "./components/admincomponents/Sidebar";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AddItems from "./pages/admindashboard/items/AddItems";
import ViewItems from "./pages/admindashboard/items/ViewItems";
import AddItemType from "./pages/admindashboard/itemtype/AddItemType";
import ViewItemType from "./pages/admindashboard/itemtype/ViewItemType";
import AddWareHouse from "./pages/admindashboard/warehouses/AddWareHouse";
import ViewWareHouses from "./pages/admindashboard/warehouses/ViewWareHouse";
import NewOrder from "./pages/admindashboard/itemstore/mainstores/NewOrder";
import AddMainStoreItems from "./pages/admindashboard/itemstore/mainstores/AddMainStores";
import ViewMainStores from "./pages/admindashboard/itemstore/mainstores/ViewMainStores";
import ViewSubStoreItems from "./pages/admindashboard/itemstore/substores/ViewSubStores";
import ViewShopItems from "./pages/admindashboard/itemstore/shope/ViewShopItems";
import EditItems from "./pages/admindashboard/items/EditItems";
import AddUsers from "./pages/admindashboard/users/AddUsers";
import ViewUsers from "./pages/admindashboard/users/ViewUsers";
import EditUsers from "./pages/admindashboard/users/EditUsers";
import EditItemType from "./pages/admindashboard/itemtype/EditItemType";
import EditWareHouse from "./pages/admindashboard/warehouses/EditWarehouse";
import Pending from "./pages/admindashboard/pending/Pending";
import History from "./pages/admindashboard/history/History";
import SalesHistory from "./pages/admindashboard/history/SalesHistory";
import Credit from "./pages/admindashboard/credit/Credit";
import Dashboard from "./pages/admindashboard/dashboard";
import PendingShopSale from "./pages/admindashboard/pending/PendingShopSale";
import PendingShopItem from "./pages/admindashboard/pending/PendingShopItems";
import { AuthContext } from "./context/Context";
import SignIn from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PendingExpense from "./pages/admindashboard/expense/PendingExpense";
import ExpenseHistory from "./pages/admindashboard/expense/ExpenseHistory";

function App() {

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext)

    if (currentUser === null) {
      return <Navigate to="/login" />
    } else {
      return children
    }
  }


  const Layout = () => {
    return (

      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            {isMobile ? <main className="content" style={{ padding: 0 }}>
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main> :
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Outlet />
              </main>}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
        <Layout />
        </ProtectedRoute>
        ),
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/add_users",
          element: <AddUsers />
        },
        {
          path: "/view_users",
          element: <ViewUsers />
        },
        {
          path: "/edit_users",
          element: <EditUsers />
        },
        {
          path: "/add_items",
          element: <AddItems />
        },
        {
          path: "/view_items",
          element: <ViewItems />
        },
        {
          path: "/edit_items",
          element: <EditItems />
        },
        {
          path: "/add_item_type",
          element: <AddItemType />
        },
        {
          path: "/view_item_type",
          element: <ViewItemType />
        },
        {
          path: "/edit_item_type",
          element: <EditItemType />
        },
       
        {
          path: "/add_ware_house",
          element: <AddWareHouse />
        },
        {
          path: "/view_ware_house",
          element: <ViewWareHouses />
        },
        {
          path: "/edit_ware_house",
          element: <EditWareHouse />
        },
        {
          path: "/mainstore",
          element: <ViewMainStores />
        },
        {
          path: "/sub_store_items",
          element: <ViewSubStoreItems />
        },
        {
          path: "/shop_items",
          element: <ViewShopItems />
        },
        {
          path: "/pending",
          element: <Pending />
        },
        {
          path: "/storehistory",
          element: <History />
        },
        {
          path: "/saleshistory",
          element: <SalesHistory />
        },
        {
          path: "/credit",
          element: <Credit />
        },
        {
          path: "/pendingshopsales",
          element: <PendingShopSale />
        },
        {
          path: "/pendingshopitems",
          element: <PendingShopItem />
        },
        {
          path: "/import",
          element: <NewOrder />
        },
        {
          path: "/add_to_main_store",
          element: <AddMainStoreItems />
        },
        {
          path: "/add_to_sub_store",
          element: <AddMainStoreItems />
        },
        {
          path: "/pending_expense",
          element: <PendingExpense />
        },
        {
          path: "/expense_history",
          element: <ExpenseHistory />
        },
        {
          path: "/changePass",
          element: <ChangePassword />,
        },
      ]
    },
    {
      path: "/login",
      element: <SignIn />,
    },
   
    {
      path: '/forgotPass',
      element: <ForgotPassword />
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
