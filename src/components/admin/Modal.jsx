import { FaTimes} from 'react-icons/fa';
export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl transform transition-all animate-modal-enter">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="font-poppins text-lg font-bold text-[#013f40]">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };