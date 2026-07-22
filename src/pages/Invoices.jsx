import { useState } from "react";
import { FileText, Plus, Printer, Trash2, Edit2, CheckCircle, Clock, AlertTriangle, X } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import InvoiceForm from "../components/InvoiceForm";
import toast from "react-hot-toast";

const Invoices = () => {
  const { invoices = [], deleteInvoice, toggleInvoiceStatus, userProfile } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [printInvoiceData, setPrintInvoiceData] = useState(null); // Print Modal state

  const currencySymbol = userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : userProfile?.currency === "PKR" ? "₨" : userProfile?.currency === "INR" ? "₹" : "$";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Invoice Management</h1>
          <p className="text-gray-500 mt-1">Create, manage, and print professional client invoices.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          {showForm && !editingItem ? "Close Form" : "Create Invoice"}
        </button>
      </div>

      {showForm && (
        <InvoiceForm
          editingItem={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Invoices List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <FileText size={40} className="mx-auto text-gray-300" />
            <h3 className="font-bold text-secondary text-lg">No invoices generated yet</h3>
            <p className="text-gray-400 text-sm">Create your first invoice above to track client billings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-mono font-bold text-secondary">{inv.invoiceNumber}</td>
                    <td className="p-4 font-medium text-secondary">{inv.clientName}</td>
                    <td className="p-4 text-gray-500">{inv.dueDate}</td>
                    <td className="p-4 font-bold text-secondary">{currencySymbol}{Number(inv.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleInvoiceStatus(inv.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition ${
                          inv.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {inv.status === "Paid" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setPrintInvoiceData(inv)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition rounded-lg hover:bg-indigo-50"
                        title="Print / View Invoice"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(inv);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
                        title="Edit Invoice"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(inv.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print / View Modal Preview */}
      {printInvoiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center print:hidden">
              <h3 className="font-bold text-secondary">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-sm transition"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button
                  onClick={() => setPrintInvoiceData(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-8 space-y-6 overflow-y-auto bg-white" id="printable-invoice">
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-secondary">💰 FINANCE APP</h2>
                  <p className="text-xs text-gray-400 mt-1">Professional Billing Services</p>
                </div>
                <div className="text-right">
                  <h4 className="text-lg font-bold text-secondary">{printInvoiceData.invoiceNumber}</h4>
                  <p className="text-xs text-gray-500">Date: {printInvoiceData.createdAt}</p>
                  <p className="text-xs text-gray-500">Due Date: {printInvoiceData.dueDate}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase">Billed To:</span>
                <h3 className="text-lg font-bold text-secondary">{printInvoiceData.clientName}</h3>
              </div>

              <table className="w-full text-left text-sm border-t border-b border-gray-100 py-4 my-4">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Status</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 font-medium text-secondary">{printInvoiceData.itemsDescription}</td>
                    <td className="py-4 text-right font-semibold text-gray-600">{printInvoiceData.status}</td>
                    <td className="py-4 text-right font-bold text-secondary">{currencySymbol}{Number(printInvoiceData.amount).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <div className="text-right space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Total Due</span>
                  <div className="text-2xl font-black text-blue-600">
                    {currencySymbol}{Number(printInvoiceData.amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-secondary">Delete Invoice</h2>
            <p className="text-gray-500 text-sm">Are you sure you want to delete this invoice? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInvoice(deleteId);
                  toast.success("Invoice deleted successfully!");
                  setDeleteId(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 text-sm shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;