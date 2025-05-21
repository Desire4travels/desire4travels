import { useState, useEffect } from 'react';
import './ManagePackage.css';

const ManagePackage = () => {
  const [formData, setFormData] = useState({
    packageName: '',
    duration: '',
    price: '',
    description: '',
    inclusions: '',
    itinerary: '',
    photo: null,
    destinations: [],
  });

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

  // Fetch existing packages
  const fetchPackages = async () => {
    try {
      const res = await fetch('https://desire4travels-1.onrender.com/api/admin/packages');
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  // Fetch destinations, adapted to your API response structure
  const fetchDestinations = async () => {
    try {
      const res = await fetch('https://desire4travels-1.onrender.com/api/destinations');
      const data = await res.json();

      console.log('Destinations fetched:', data);

      // The API returns an object with a destinations array
      if (data.destinations && Array.isArray(data.destinations)) {
        // Normalize each destination object to ensure _id exists
        setDestinations(data.destinations.map(d => ({ ...d, _id: d._id || d.id })));
      } else {
        console.error('Destinations API response does not contain destinations array:', data);
        setDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'destinations') {
      // Multiple selection from the destinations <select>
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedValues = selectedOptions.map(option => option.value);
      setFormData(prev => ({
        ...prev,
        destinations: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));

      if (files && files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append form data including destinations as JSON string
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'destinations') {
        data.append('destinations', JSON.stringify(val));
      } else if (val !== null) {
        data.append(key, val);
      }
    });

    const url = editingId
      ? `https://desire4travels-1.onrender.com/api/admin/packages/${editingId}`
      : 'https://desire4travels-1.onrender.com/api/admin/packages';

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      alert(editingId ? 'Package updated!' : 'Package created!');

      // Reset form
      setFormData({
        packageName: '',
        duration: '',
        price: '',
        description: '',
        inclusions: '',
        itinerary: '',
        photo: null,
        destinations: [],
      });
      setPreviewImage(null);
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit package');
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      packageName: pkg.packageName,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description,
      inclusions: pkg.inclusions,
      itinerary: pkg.itinerary,
      photo: null,
      destinations: Array.isArray(pkg.destinations) ? pkg.destinations : [],
    });
    setPreviewImage(pkg.photo);
    setEditingId(pkg._id || pkg.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const res = await fetch(`https://desire4travels-1.onrender.com/api/admin/packages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete package');
      alert('Package deleted');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  return (
    <div className="manage-package">
      <div className="form-section">
        <h2>{editingId ? 'Edit Package' : 'Add Package'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="packageName"
            placeholder="Package Name"
            value={formData.packageName}
            onChange={handleChange}
            required
          />

          <label>Select Multiple Destinations (Hold Ctrl/Cmd to select multiple)</label>
          <select
            multiple
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            required
            size={5}
            className="multiple-select"
          >
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>
                {dest.name} - {dest.state}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <textarea
            name="inclusions"
            placeholder="Inclusions"
            value={formData.inclusions}
            onChange={handleChange}
            required
          />
          <textarea
            name="itinerary"
            placeholder="Itinerary"
            value={formData.itinerary}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />
          {previewImage && <img src={previewImage} alt="Preview" height="100" />}
          <button type="submit">{editingId ? 'Update' : 'Add'} Package</button>
        </form>
      </div>

      <div className="table-section">
        <h3>Existing Packages</h3>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Package Name</th>
              <th>Destinations</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Description</th>
              <th>Inclusions</th>
              <th>Itinerary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => {
              // Map destination IDs to names for display
              const selectedDests = Array.isArray(pkg.destinations)
                ? pkg.destinations.map(destId => {
                    const match = destinations.find(d => d._id === destId);
                    return match ? `${match.name} - ${match.state}` : 'Unknown';
                  }).join(', ')
                : 'No destinations';

              return (
                <tr key={pkg._id || pkg.id}>
                  <td>
                    <img
                      src={pkg.photo}
                      alt={pkg.packageName}
                      width="100"
                    />
                  </td>
                  <td>{pkg.packageName}</td>
                  <td>{selectedDests}</td>
                  <td>{pkg.duration}</td>
                  <td>{pkg.price}</td>
                  <td>{pkg.description}</td>
                  <td>{pkg.inclusions}</td>
                  <td>{pkg.itinerary}</td>
                  <td>
                    <button onClick={() => handleEdit(pkg)}>Edit</button>
                    <button onClick={() => handleDelete(pkg._id || pkg.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePackage;
