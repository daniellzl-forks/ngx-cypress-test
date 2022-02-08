/// <reference types="cypress" />

describe("Example Test Suite", () => {
  it("getting DOM elements", () => {
    cy.visit("/");

    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get("input");
    cy.get("#inputEmail");
    cy.get(".input-full-width");
    cy.get('[class="input-full-width size-medium shape-rectangle"]');
    cy.get("[placeholder]");
    cy.get('[placeholder="Email"]');
    cy.get('input[placeholder="Email"]');
    cy.get('[data-cy="signInButton"]');
    cy.get('[placeholder="Email"][type="email"]');
    cy.get('input[placeholder="Email"]#inputEmail.input-full-width');
  });

  it("getting child DOM elements", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get('[data-cy="signInButton"]');
    cy.contains("Sign in");
    cy.contains('[status="warning"]', "Sign in");

    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    cy.contains("nb-card", "Horizontal form").find('[type="email"]');
  });

  /*
    Saving Subject of the Command
  */
  it("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // cypress is async
    // .then is a jQuery method, callback can use jQuery methods
    cy.contains("nb-card", "Using the Grid").then(($firstForm) => {
      const emailLabelFirst = $firstForm.find('[for="inputEmail1"]').text();
      const passwordLabelFirst = $firstForm
        .find('[for="inputPassword2"]')
        .text();
      expect(emailLabelFirst).to.equal("Email");
      expect(passwordLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then(($secondForm) => {
        const passwordSecondText = $secondForm
          .find('[for="exampleInputPassword1"]')
          .text();

        expect(passwordLabelFirst).to.equal(passwordSecondText);

        // .wrap turns jQuery objects back to cypress object
        cy.wrap($secondForm)
          .find('[for="exampleInputPassword1"]')
          .should("contain", "Password");
      });
    });
  });

  /*
    Invoke invokes a function on a cy element
  */
  it("invoke command - 2 use cases", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // case 1
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
      expect(label).to.have.class('label');
      expect(label.text()).to.equal('Email address');
    });
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    // case 2
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      // .should('contain', 'checked')
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  it("invoke command - date picker", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        cy.get("nb-calendar-day-picker").contains("17").click();
        cy.wrap(input)
          .invoke("prop", "value")
          .should("contain", "Feb 17, 2022");
      });
  });

  /*
    Checkboxes and Radio Buttons
  */
  it("radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should("be.checked");

        cy.wrap(radioButtons).eq(1).check({ force: true });

        cy.wrap(radioButtons).eq(0).should("not.be.checked");

        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });

  it("check boxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    // cy.get('[type="checkbox"]').check({ force: true });
    cy.get('[type="checkbox"]').eq(0).click({ force: true });
    cy.get('[type="checkbox"]').eq(1).check({ force: true });
  });

  /*
    Lists and Dropdowns
  */
  it("lists and dropdowns", () => {
    cy.visit("/");

    // 1 - one dropdown option click only
    // cy.get('nav nb-select').click();
    // cy.get('.options-list').contains('Dark').click();
    // cy.get('nav nb-select').should('contain', 'Dark')
    // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(24, 43, 69)');

    // 2 - all dropdown option clicks
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim();

        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };

        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );
        if (index < 3) cy.wrap(dropdown).click();
      });
    });
  });

  /*
    Web Tables
  */
  it("Web Tables", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", "25");
      });

    // 2
    cy.get("thead").find(".nb-plus").click();
    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("Artem");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Bondar");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((tableColumns) => {
        cy.wrap(tableColumns).eq(2).should("contain", "Artem");
        cy.wrap(tableColumns).eq(3).should("contain", "Bondar");
        cy.wrap();
      });

    // 3
    const age = [20, 30, 40, 200];
    cy.wrap(age).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(500);
      cy.get("tbody tr").each((tableRow) => {
        if (age == 200) cy.wrap(tableRow).should("contain", "No data found");
        else cy.wrap(tableRow).find("td").eq(6).should("contain", age);
      });
    });
  });

  /*
    Date Picker
  */
  it("Date picker", () => {
    function selectDayFromCurrent(day) {
      let date = new Date();
      date.setDate(date.getDate() + day);
      let futureDay = date.getDate();
      let futureMonth = date.toLocaleDateString("default", { month: "short" });
      let dateAssert = `${futureMonth} ${futureDay}, ${date.getFullYear()}`;

      cy.get("nb-calendar-navigation")
        .invoke("attr", "ng-reflect-date")
        .then((dateAttribute) => {
          if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click();
            selectDayFromCurrent(day);
          } else {
            cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]')
              .contains(futureDay)
              .click();
          }
        });

      return dateAssert;
    }

    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dateAssert = selectDayFromCurrent(300);
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should('have.value', dateAssert);
      });
  });

  /*
    Popups and Tooltips

    Cypress doesn't use mouseover event
    Cypress is configured to automatically confirm dialog boxes
  */
  it("Tooltips", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  it("Browser Dialog Box", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1
    // Detects for window alerts
    // NOT RECOMMENDED
    // cy.get("tbody tr").first().find(".nb-trash").click();
    // cy.on("window:confirm", (confirm) => {
    //   expect(confirm).to.equal("Are you sure you want to delete?");
    // });

    // 2
    // Use stub because we can save the results of the alert
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .first()
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });

    // 3
    // If you don't care about confirm, automatically cancel confirmation
    // cy.get("tbody tr").first().find(".nb-trash").click();
    // cy.on("window:confirm", () => false);
  });
});
