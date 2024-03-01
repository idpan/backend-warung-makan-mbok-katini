const Tumpeng = require("../models/Tumpeng");
const fs = require("fs").promises; // Use fs.promises for asynchronous file operations

/**
 * Get all tumpeng.
 * Endpoint: GET /tumpeng
 */
const getTumpeng = async (req, res) => {
  try {
    // Fetch all tumpeng data from the database
    const data = await Tumpeng.all();
    res.status(200).json({ message: "Get tumpeng success", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Create a new tumpeng.
 * Endpoint: POST /tumpeng
 */
const createTumpeng = async (req, res) => {
  const allowedColumns = ["name", "description", "image", "category", "price"];
  const values = {};

  // Extract allowed columns from the request body
  allowedColumns.forEach((column) => {
    if (column !== "image") {
      values[column] = req.body[column];
    } else {
      // If there is an image in the request, use its filename
      if (req.file) {
        values[column] = req.file.filename;
      }
    }
  });

  try {
    // Create a new tumpeng in the database
    const { insertId } = await Tumpeng.create(values);

    // Fetch the newly created tumpeng data
    const data = await Tumpeng.find(insertId);

    // Respond with success and the newly created tumpeng data
    res.status(200).json({ message: "New tumpeng created successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update a tumpeng by ID.
 * Endpoint: PATCH /tumpeng/:id
 */
const updateTumpeng = async (req, res) => {
  const tumpengId = req.params.id;
  const allowedColumns = ["name", "description", "image", "category", "price"];
  let updateQuery = "UPDATE tumpeng SET ";
  const updatedColumns = [];
  const values = [];
  let isImageUpdated = false;

  // Build the update query and values based on allowed columns
  allowedColumns.forEach((allowedColumn) => {
    if (allowedColumn === "image") {
      if (req.file) {
        updatedColumns.push("image = ?");
        values.push(req.file.filename);
        isImageUpdated = true;
      }
    } else if (req.body[allowedColumn] !== undefined) {
      updatedColumns.push(`${allowedColumn} = ?`);
      values.push(req.body[allowedColumn]);
    }
  });

  // Ensure at least one data field is updated
  if (updatedColumns.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one data should be updated" });
  }

  // Construct the full update query
  updateQuery += updatedColumns.join(", ");
  updateQuery += ` WHERE tumpeng_id = ?`;
  values.push(tumpengId);

  try {
    // If image is updated, delete the old image from the server
    if (isImageUpdated) {
      const [{ image }] = await Tumpeng.find(tumpengId); // Retrieve old image filename
      await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + image);
    }

    // Update the tumpeng in the database
    await Tumpeng.update(updateQuery, values);

    // Fetch the updated tumpeng
    const data = await Tumpeng.find(tumpengId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Tumpeng with id ${tumpengId} does not exist`);
    }

    // Respond with success and the updated tumpeng data
    res.status(200).json({ message: "Tumpeng updated successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a tumpeng by ID.
 * Endpoint: DELETE /tumpeng/:id
 */
const deleteTumpeng = async (req, res) => {
  const tumpengId = req.params.id;

  try {
    // Fetch the tumpeng data to be deleted
    const data = await Tumpeng.find(tumpengId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Tumpeng with id ${tumpengId} does not exist`);
    }

    // Delete the image associated with the tumpeng from the server
    await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + data[0].image);

    // Delete the tumpeng from the database
    await Tumpeng.deleteTumpeng(tumpengId);

    // Respond with success and the deleted tumpeng data
    res.status(200).json({
      message: `Tumpeng with id = ${tumpengId} deleted successfully`,
      data,
    });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTumpeng,
  createTumpeng,
  updateTumpeng,
  deleteTumpeng,
};
