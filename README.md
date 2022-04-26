# blocco-js

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Product Screenshots

**Day view**

![2022-04-21 at 11 13 am](https://user-images.githubusercontent.com/1835120/164433397-616dff6f-4a22-4dad-aaca-1ad720380e01.png)

**Week view**

![2022-04-21 at 11 12 am](https://user-images.githubusercontent.com/1835120/164433265-6ea9a919-08b4-4dfa-aa68-c6da2c7e4e7c.png)

**Dark Mode**

![2022-04-26 at 11 18 pm](https://user-images.githubusercontent.com/1835120/165402012-dc1afbbb-a898-42bb-97e0-7b094a1a6de0.png)


## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint`
* `yarn lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


## Dialog Example

```hbs
  <Dialog
    class='fixed inset-0 z-100 overflow-y-auto'
    @as='div'
    @isOpen={{this.showAddEventDialog}}
    @onClose={{set this 'showAddEventDialog' false}}
    as |dialog|
  >
    <div class='min-h-screen'>
      <dialog.Overlay class='fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 transition-opacity' />
      <div class='fixed bg-white dark:bg-gray-800 inset-y-0 right-0 w-4/12 px-10 pt-4'>
        <dialog.Title class='text-lg font-medium text-gray-900 dark:text-gray-100 leading-6' @as='h3'>
          Add Event
        </dialog.Title>

        <dialog.Description class='text-sm text-gray-500 dark:text-gray-100'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </dialog.Description>

        <div class="mt-5">
          <button type="button" {{on 'click' (set this 'showAddEventDialog' false)}}>Done</button>
        </div>
      </div>
    </div>
  </Dialog>
```
