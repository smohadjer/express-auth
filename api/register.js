export default (req, res) => {
  if (req.body) {
    console.log('got body');
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
  }
}
