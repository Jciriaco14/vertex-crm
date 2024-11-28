import React, { useState, useEffect } from 'react';
import { 
  Users, PlusCircle, Search, ChevronDown, ChevronUp, 
  Calendar, Trash2, Edit, ArrowDownAZ, Filter 
} from 'lucide-react';function App() {
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [editingClient, setEditingClient] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = ['Lead', 'Active', 'Inactive', 'Pending', 'Completed'];
  const serviceOptions = [
    'Digital Marketing',
    'Web Development',
    'Social Media Management',
    'Content Creation',
    'Brand Strategy'
  ];
  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];// Fetch clients from backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('https://vertex-crm-backend.onrender.com/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedClients = () => {
    const filtered = clients.filter(client => 
      filterStatus === 'all' || client.status === filterStatus
    ).filter(client =>
      Object.values(client).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };const addClient = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      company: e.target.company.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      status: e.target.status.value,
      service: e.target.service.value,
      budget: e.target.budget.value,
      lastContact: e.target.lastContact.value,
      followUp: e.target.followUp.value,
      notes: e.target.notes.value,
    };

    try {
      const response = await fetch('https://vertex-crm-backend.onrender.com/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setClients([...clients, data]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const updateClient = async (id, updatedData) => {
    try {
      const response = await fetch(`https://vertex-crm-backend.onrender.com/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();
      setClients(clients.map(client => 
        client._id === id ? data : client
      ));
      setEditingClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const deleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await fetch(`https://vertex-crm-backend.onrender.com/api/clients/${id}`, {
          method: 'DELETE'
        });
        setClients(clients.filter(client => client._id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'service', label: 'Service Interest', sortable: true },
    { key: 'budget', label: 'Budget Range', sortable: true },
    { key: 'lastContact', label: 'Last Contact', sortable: true },
    { key: 'followUp', label: 'Follow-up Date', sortable: true },
    { key: 'notes', label: 'Notes', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 shadow">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Vertex Connections CRM</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border-0 py-2 px-3 focus:ring-2 focus:ring-blue-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-50"
            >
              <PlusCircle size={20} />
              Add Client
            </button>
          </div>
        </div>
      </div>
    </div>{/* Main Content */}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.key}
                      onClick={() => column.sortable && handleSort(column.key)}
                      className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && sortConfig.key === column.key && (
                          sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedClients().map((client) => (
                  <tr key={client._id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          client.status === 'Lead' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.lastContact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.followUp}</td>
                    <td className="px-6 py-4">{client.notes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingClient(client)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteClient(client._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>{/* Add/Edit Client Modal */}
      {(showAddForm || editingClient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                name: e.target.name.value,
                company: e.target.company.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                status: e.target.status.value,
                service: e.target.service.value,
                budget: e.target.budget.value,
                lastContact: e.target.lastContact.value,
                followUp: e.target.followUp.value,
                notes: e.target.notes.value,
              };
              
              if (editingClient) {
                updateClient(editingClient._id, formData);
              } else {
                addClient(e);
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingClient?.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingClient?.company}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingClient?.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingClient?.phone}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    defaultValue={editingClient?.status || 'Lead'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Interest</label>
                  <select
                    name="service"
                    defaultValue={editingClient?.service}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {serviceOptions.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                  <select
                    name="budget"
                    defaultValue={editingClient?.budget}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                  <input
                    type="date"
                    name="lastContact"
                    defaultValue={editingClient?.lastContact}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                  <input
                    type="date"
                    name="followUp"
                    defaultValue={editingClient?.followUp}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    defaultValue={editingClient?.notes}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingClient ? 'Update Client' : 'Add Client'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingClient(null);
                  }}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;