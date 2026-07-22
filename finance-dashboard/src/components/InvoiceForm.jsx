import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import toast from "react-hot-toast";

const InvoiceForm = ({ editingItem, onClose }) => {
  const { addInvoice, updateInvoice } = useFinance();

  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-" + Math.floor(1000 + Math.random() * 9000));
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Unpaid");
  const [itemsDescription, setItemsDescription] = useState("");

  useEffect(() => {
    if (editingItem) {
      setClientName(editingItem.clientName || "");
      setInvoiceNumber(editingItem.invoiceNumber || "");
      setAmount(editingItem.amount || "");
      setDueDate(editingItem.dueDate || "");
      setStatus(editingItem.status || "Unpaid");
      setItemsDescription(editingItem.itemsDescription || "");
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !amount || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const invoiceData = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      clientName,
      invoiceNumber,
      amount: parseFloat(amount),
      dueDate,
      status,
      itemsDescription: itemsDescription || "Professional Services / Web Development",
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString().split("T")[0],
    };

    if (editingItem) {
      updateInvoice(invoiceData);
      toast.success("Invoice updated successfully!");
    } else {
      addInvoice(invoiceData);
      toast.success("Invoice created successfully!");
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-bold text-secondary">
        {editingItem ? "Edit Invoice" : "Create New Invoice"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50 font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description / Services</label>
          <input
            type="text"
            value={itemsDescription}
            onChange={(e) => setItemsDescription(e.target.value)}
            placeholder="e.g. Frontend Development & UI Design"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          {editingItem ? "Update Invoice" : "Save Invoice"}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;