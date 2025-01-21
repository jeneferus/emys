import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import ConfirmBox from '../components/CofirmBox';
import EditOrderModal from '../components/EditOrderModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import toast from 'react-hot-toast';

const AllOrdersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ orderId: '', userName: '', startDate: '', endDate: '', status: '' });
  const [deleteOrder, setDeleteOrder] = useState({ orderId: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [detailsOrder, setDetailsOrder] = useState(null);

  const columnHelper = createColumnHelper();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        orderId: filters.orderId || '',
        userName: filters.userName || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        status: filters.status || '',
      }).toString();

      const response = await Axios.get(`/api/allorders/get?${queryParams}`);
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      } else {
        toast.error(responseData.message || 'Error fetching orders');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const truncateText = (text, maxLength) => text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  // Función para obtener el estilo del estado
  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    columnHelper.accessor('orderId', {
      header: "Order ID",
      cell: ({ row }) => truncateText(row.original.orderId, 8),
    }),
    columnHelper.accessor('userId.name', {
      header: "User",
      cell: ({ row }) => row.original.userId?.name || 'N/A',
    }),
    columnHelper.accessor('status', {
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    }),
    columnHelper.accessor('products', {
      header: "Products",
      cell: ({ row }) => (
        <div>
          {row.original.products.map((product, index) => (
            <div key={product.productId._id + index}>
              <p>{truncateText(product.product_details?.name || 'N/A', 8)} - {product.quantity} units</p>
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('_id', {
      header: "Actions",
      cell: ({ row }) => (
        <div className='flex gap-3'>
          <button
            onClick={() => {
              setOpenDetailsModal(true);
              setDetailsOrder(row.original);
            }}
            className='p-2 bg-blue-100 rounded-full hover:text-blue-600'
          >
            <AiOutlineEye size={20} />
          </button>
          <button
            onClick={() => {
              setOpenEditModal(true);
              setEditOrder(row.original);
            }}
            className='p-2 bg-green-100 rounded-full hover:text-green-600'
          >
            <HiPencil size={20} />
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true);
              setDeleteOrder({ orderId: row.original.orderId });
            }}
            className='p-2 bg-red-100 rounded-full hover:text-red-600'
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    }),
  ];

  const handleDeleteOrder = async () => {
    try {
      const response = await Axios.delete('/api/allorders/delete', {
        data: deleteOrder,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchOrders();
        setOpenDeleteConfirmBox(false);
      } else {
        toast.error(responseData.message || 'Failed to delete order');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <section className='p-4'>
      <div className='p-2 bg-white shadow-md'>
        <h2 className='font-semibold'>All Orders</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <input
            type='text'
            name='orderId'
            placeholder='Order ID'
            value={filters.orderId}
            onChange={handleFilterChange}
            className='border p-2 w-full'
          />
          <input
            type='text'
            name='userName'
            placeholder='User Name'
            value={filters.userName}
            onChange={handleFilterChange}
            className='border p-2 w-full'
          />
          <input
            type='date'
            name='startDate'
            value={filters.startDate}
            onChange={handleFilterChange}
            className='border p-2 w-full'
          />
          <input
            type='date'
            name='endDate'
            value={filters.endDate}
            onChange={handleFilterChange}
            className='border p-2 w-full'
          />
          <select
            name='status'
            value={filters.status}
            onChange={handleFilterChange}
            className='border p-2 w-full'
          >
            <option value=''>All Statuses</option>
            <option value='COMPLETED'>Completed</option>
            <option value='PENDING'>Pending</option>
            <option value='DELIVERED'>Delivered</option>
            <option value='CANCELLED'>Cancelled</option>
            <option value='SHIPPED'>Shipped</option>
          </select>
        </div>
      </div>

      <div className='mt-4' style={{ overflowX: 'auto' }}>
        <DisplayTable
          data={data}
          column={columns}
          loading={loading}
        />
      </div>

      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteOrder}
        />
      )}

      {openEditModal && (
        <EditOrderModal
          data={editOrder}
          close={() => setOpenEditModal(false)}
          fetchOrders={fetchOrders}
        />
      )}

      {openDetailsModal && (
        <OrderDetailsModal
          data={detailsOrder}
          close={() => setOpenDetailsModal(false)}
        />
      )}
    </section>
  );
};

export default AllOrdersPage;