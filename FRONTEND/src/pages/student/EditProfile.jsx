function EditProfile() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <input placeholder="LinkedIn" className="input input-bordered w-full mb-3" />
      <input placeholder="GitHub" className="input input-bordered w-full mb-3" />
      <input placeholder="LeetCode" className="input input-bordered w-full mb-3" />

      <input type="file" className="file-input file-input-bordered w-full mb-3" />

      <button className="btn btn-success w-full">Save</button>
    </div>
  );
}

export default EditProfile;