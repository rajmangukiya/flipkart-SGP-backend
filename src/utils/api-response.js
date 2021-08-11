export const apiResponse = (res, status, data, message, error) => {
  res
    .status(status)
    .json({
      data,
      message,
      error
    })
}