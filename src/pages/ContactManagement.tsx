import { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaTrash, FaEye, FaCalendarAlt } from "react-icons/fa";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/v1/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      setError(error.response?.data?.error || "Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      
      // Delete multiple contacts
      await Promise.all(
        selectedContacts.map(contactId =>
          axios.delete(`${API_BASE_URL}/api/v1/contact/${contactId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact._id)));
      setSelectedContacts([]);
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error("Error deleting contacts:", error);
      setError(error.response?.data?.error || "Failed to delete contacts");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSingle = async (contactId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/v1/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(prev => prev.filter(contact => contact._id !== contactId));
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      setError(error.response?.data?.error || "Failed to delete contact");
    }
  };

  const handleViewContact = (contact: Contact) => {
    setViewContact(contact);
    setShowViewModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
        <p className="text-gray-600">Manage contact messages from your portfolio website</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedContacts.length === contacts.length && contacts.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">
              Select All ({selectedContacts.length}/{contacts.length})
            </span>
          </label>
        </div>

        {selectedContacts.length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash className="w-4 h-4" />
            Delete Selected ({selectedContacts.length})
          </button>
        )}
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaEnvelope className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contact messages</h3>
          <p className="text-gray-600">Contact messages from your portfolio website will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => handleSelectContact(contact._id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaEnvelope className="w-3 h-3" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaPhone className="w-3 h-3" />
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {contact.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FaCalendarAlt className="w-3 h-3" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(contact._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Contacts</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedContacts.length} selected contact message{selectedContacts.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && viewContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{viewContact.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <a
                  href={`mailto:${viewContact.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {viewContact.email}
                </a>
              </div>

              {viewContact.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <a
                    href={`tel:${viewContact.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {viewContact.phone}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900">{viewContact.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewContact.message}</p>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(viewContact.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(viewContact.updatedAt)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDeleteSingle(viewContact._id);
                  setShowViewModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement; 