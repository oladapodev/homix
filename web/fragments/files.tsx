import type { FileRecord } from "@/db/types";
import type { FC } from "hono/jsx";

export const FileUploadForm: FC = () => (
  <form
    class="form-panel"
    method="post"
    action="/files"
    hx-post="/files"
    hx-target="#file-list"
    hx-swap="outerHTML"
    enctype="multipart/form-data"
  >
    <label class="fieldset">
      <span class="fieldset-legend">Upload</span>
      <input class="file-input" type="file" name="file" required />
    </label>
    <button class="btn btn-primary" type="submit">
      Upload file
    </button>
  </form>
);

export const FileList: FC<{ files: FileRecord[] }> = ({ files }) => (
  <div id="file-list" class="table-panel">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td>
              <a class="link" href={`/files/${file.key}`}>
                {file.filename}
              </a>
            </td>
            <td>{file.contentType}</td>
            <td>{file.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
